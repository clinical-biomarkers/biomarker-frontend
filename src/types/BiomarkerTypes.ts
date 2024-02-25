// Compliant with data model schema v0.3.1

/// Top level models ///

export interface BiomarkerModel {
  biomarker_id: string;
  biomarker_component: BiomarkerComponent[];
  best_biomarker_role: BiomarkerRole[];
  condition?: Condition | null;
  exposure_agent?: ExposureAgent | null;
  evidence_source: EvidenceSource[] | null;
  citation: Citation[] | null;
};

// Evidence source models 

interface EvidenceSource {
  evidence_id: string;
  database: string;
  url: string | null;
  evidence_list: EvidenceEntry[] | null;
  tags: Tag[];
}

interface EvidenceEntry {
  evidence: string;
}

interface Tag {
  tag: string;
}

// Biomarker role model 

interface BiomarkerRole {
  role: string;
}

// Condition models 

interface Condition {
  condition_id: string;
  recommended_name: RecName;
  synonyms: ConditionSynonyms[];
}

interface RecName {
  condition_id: string;
  name: string;
  description: string;
  resource: string;
  url: string;
}

interface ConditionSynonyms {
  synonym_id: string;
  name: string;
  resource: string;
  url: string;
}

// Exposure agent models 

interface ExposureAgent {
  exposure_agent_id: string;
  recommended_name: ExAgentRecName;
}

interface ExAgentRecName {
  exposure_agent_id: string;
  name: string;
  description: string;
  resource: string;
  url: string;
}

// Citation models

interface Citation {
  citation_title: string;
  journal: string;
  authors: string;
  date: string;
  reference: Reference[];
  evidence_source: CitationEvSource[];
}

interface Reference {
  reference_id: string;
  type: string;
  url: string;
}

interface CitationEvSource {
  evidence_id: string;
  database: string;
  url: string;
}

/// Biomarker component models ///

interface BiomarkerComponent {
  biomarker: string;
  assessed_biomarker_entity: BiomarkerEntity;
  assessed_biomarker_entity_id: string;
  assessed_entity_type: string;
  specimen: Specimen[] | null;
  evidence_source: EvidenceSource[];
}

// Biomarker entity models

interface BiomarkerEntity {
  recommended_name: string;
  synonyms: EntitySynonyms[] | null;
}

interface EntitySynonyms {
  "synonym": string;
}

// Specimen models

interface Specimen {
  name: string | null;
  specimen_id: string | null;
  name_space: string | null;
  url: string | null;
  loinc_code: string | null;
}
