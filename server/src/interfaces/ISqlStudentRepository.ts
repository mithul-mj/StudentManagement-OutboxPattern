export interface ISqlStudentRepository {
  createOrUpdate(data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  }): Promise<void>;

  update(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<void>;

  delete(id: string): Promise<void>;
}
