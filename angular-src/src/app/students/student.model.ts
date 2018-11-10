export interface Student {
  name: string,
  email: string,
  profiles: Profiles
}

export interface Profiles {
  github: string;
  linkedin: string;
  twitter: string;
}
