export interface Student {
  id: string;
  filename: string;
  name: string;
  email: string;
  profiles: Profiles;
  downloadUrl: string;
}

export interface Profiles {
  github: string;
  linkedin: string;
  twitter: string;
}
