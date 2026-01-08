export interface Context {
  payload: {
    pull_request: head_base;
  };
}

interface head_base {
  head: sha_ref;
  base: sha_ref;
}

interface sha_ref {
  sha: string;
  ref: string;
}
