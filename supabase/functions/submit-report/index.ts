import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportData {
  incidentType: string;
  communityName?: string;
  encryptedDescription: string;
  encryptedEvidence?: string;
  incidentDate?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const reportData: ReportData = await req.json();
    
    console.log('Received report submission', {
      incidentType: reportData.incidentType,
      hasCommunity: !!reportData.communityName,
      hasEvidence: !!reportData.encryptedEvidence,
    });

    // Create tamper-proof hash of the entire report
    const reportContent = JSON.stringify({
      incidentType: reportData.incidentType,
      communityName: reportData.communityName,
      encryptedDescription: reportData.encryptedDescription,
      encryptedEvidence: reportData.encryptedEvidence,
      incidentDate: reportData.incidentDate,
      timestamp: new Date().toISOString(),
    });

    // Generate SHA-256 hash for blockchain-style verification
    const encoder = new TextEncoder();
    const data = encoder.encode(reportContent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const reportHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Generated report hash:', reportHash);

    // Store the encrypted report
    const { data: insertedReport, error } = await supabase
      .from('reports')
      .insert({
        incident_type: reportData.incidentType,
        community_name: reportData.communityName,
        encrypted_description: reportData.encryptedDescription,
        encrypted_evidence: reportData.encryptedEvidence,
        incident_date: reportData.incidentDate,
        report_hash: reportHash,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting report:', error);
      throw error;
    }

    console.log('Report submitted successfully', { id: insertedReport.id });

    return new Response(
      JSON.stringify({
        success: true,
        reportHash,
        reportId: insertedReport.id,
        timestamp: insertedReport.created_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in submit-report function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the report';
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});