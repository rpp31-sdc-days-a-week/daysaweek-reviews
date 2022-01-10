import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 600 },
    { duration: '5m', target: 600 },
    { duration: '2m', target: 800 },
    { duration: '5m', target: 800 },
    { duration: '2m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '10m', target: 0 }
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:3000'; // make sure this is not production

  const responses = http.batch([
    ['GET', `${BASE_URL}/api/reviews/59553`, null, { tags: { name: 'Reviews' } }]
  ]);

  sleep(1);
}
