export default function isUUID(uuid: string) {
  return uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
}

export const idOrSlug = (id: string) =>
  ({ id: isUUID(id) ? id : undefined, slug: isUUID(id) ? undefined : id });

export const idOrStudentId = (id: string) =>
  ({ id: isUUID(id) ? id : undefined, student_id: isUUID(id) ? undefined : id });
