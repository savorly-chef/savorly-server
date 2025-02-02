export interface AppleAuthCredential {
  user: string; // The unique identifier for the user
  email?: string; // The user's email (might be null if user doesn't share)
  fullName?: {
    // The user's full name (might be null if user doesn't share)
    familyName?: string;
    givenName?: string;
    middleName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    nickname?: string;
  };
  identityToken: string; // A JSON Web Token that securely communicates information about the user to your app
  realUserStatus?: number; // A value that indicates whether the user appears to be a real person
  authorizationCode: string; // A short-lived token used by your app for proof of authorization
  state?: string; // An arbitrary string that your app provided to the request that generated the credential
}
