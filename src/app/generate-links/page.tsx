import { KJUR } from 'jsrsasign';
import { format } from 'date-fns';

const SDK_KEY = process.env.ZOOM_SDK_KEY!;
const SDK_SECRET = process.env.ZOOM_SDK_SECRET!;
const BASE_URL = 'https://videosdk-nextjs-quickstart.vercel.app/call/zoom'; // change to your live domain

if (!SDK_KEY || !SDK_SECRET) {
  throw new Error('Missing ZOOM_SDK_KEY or ZOOM_SDK_SECRET in env');
}

type Participant = {
  name: string;
  role: 0 | 1;
};

const participants: Participant[] = [
  { name: 'Erik Weller', role: 0 },
  { name: 'CareVillage: Lani Weller', role: 1 },
  { name: 'Leopold Weller', role: 0 },
  { name: 'Lucian Weller', role: 0 },
];

function generateSignature(topic: string, role: 0 | 1): string {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    app_key: SDK_KEY,
    tpc: topic,
    role_type: role,
    iat,
    exp,
    tokenExp: exp,
  };

  return KJUR.jws.JWS.sign('HS256', JSON.stringify(header), JSON.stringify(payload), SDK_SECRET);
}

export default function GenerateLinksPage() {
  const topic = `cv-dev-meeting-${Date.now()}`;
  const timestamp = format(new Date(), 'PPpp');

  return (
    <div className="min-h-screen bg-gray-50 p-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center">Zoom Meeting Link Generator</h1>
      <p className="text-center mb-8 text-sm text-gray-500">Generated on {timestamp}</p>

      <div className="space-y-4 max-w-3xl mx-auto">
        {participants.map(({ name, role }) => {
          const signature = generateSignature(topic, role);
          const url = `${BASE_URL}?topic=${topic}&name=${encodeURIComponent(name)}&sdkKey=${SDK_KEY}&signature=${signature}&role=${role}`;

          return (
            <div
              key={name}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{name}</p>
                  <p className="text-sm text-gray-500">{role === 1 ? 'Host' : 'Participant'}</p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 text-sm break-all"
                >
                  Join Link
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
