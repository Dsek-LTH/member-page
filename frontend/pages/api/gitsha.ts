// import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { SHAResult } from '~/types/SHAResult';

export default function handler(req, res) {
  let sha = readFileSync('../.git/HEAD').toString().trim();
  if (sha.indexOf(':') !== -1) {
    sha = readFileSync(`../.git/${sha.substring(5)}`).toString().trim();
  }

  const result: SHAResult = {
    fullSHA: sha,
    shortSHA: sha.substring(0, 7),
    commitLink: `https://github.com/Dsek-LTH/member-page/commit/${sha}`,
    treeLink: `https://github.com/Dsek-LTH/member-page/tree/${sha}`,
  };
  res.status(200).json(result);
}
