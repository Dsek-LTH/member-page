export type GoverningDocument = {
  id: string;
  title: string;
  url: string;
  document_type: GoverningDocumentType;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

export enum GoverningDocumentType {
  Policy = 'POLICY',
  Guideline = 'GUIDELINE',
}
