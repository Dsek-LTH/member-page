import { execSync } from 'child_process';
import { SHAResult } from '~/types/SHAResult';

export default function handler(req, res) {
  const sha = execSync('git rev-parse HEAD').toString().trim();
  const result: SHAResult = {
    fullSHA: sha,
    shortSHA: sha.substring(0, 7),
    commitLink: `https://github.com/Dsek-LTH/member-page/commit/${sha}`,
    treeLink: `https://github.com/Dsek-LTH/member-page/tree/${sha}`,
  };
  res.status(200).json(result);
}
