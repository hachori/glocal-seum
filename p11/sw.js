'use strict';

const scope = new URL(self.registration.scope);
const prefix = 'glocal-seum-p11-ebooks:' + scope.pathname + ':';
// Advance this dated release ID when the shell, books or asset inventory changes.
const version = '2026-11-24-01';
const cacheName = prefix + version;
const readyKey = new URL('./.offline-ready', scope).href;
const books = ['jawoon', 'daedeok', 'jeonmin'];
const shellFiles = [
  './',
  'shelf.css',
  'shelf.js',
  'manifest.webmanifest',
  'icons/app-192.png',
  'icons/app-512.png',
  ...books.map(book => 'ebooks/' + book + '.html'),
  ...books.map(book => 'ebooks/covers/' + book + '.webp')
];

// The immutable asset filenames are generated from the three readers.
const assetFiles = [
  '00468eec648edfc1aba1403a.webp',
  '01dc6edfe57b1989aa55b7fd.webp',
  '020e9649001e51c0c46a8eb5.webp',
  '022ad90e2cbc65154cf02bc4.webp',
  '03225fa40e42415904e3579a.woff2',
  '0358e0d9ca1374fa1fa58a27.png',
  '039b5a4e73322dc54334a166.webp',
  '045ddb740c728f3a0bd38c55.webp',
  '08a6119e32c2759b01baf271.png',
  '0924f388be42b21e3606d24e.png',
  '0a88bab0382557ccd7bff424.png',
  '0c99b7e36fb6d5c2f6742fbd.webp',
  '0de54da18fcfae4bd2d38ec3.png',
  '0feebe562ad99640758e7cf4.webp',
  '1022cc3ce64fedcd7d4e4d7a.webp',
  '10801f7ba0679551403a79f9.png',
  '11ad32eee41ef776d56fba91.webp',
  '125b628f85bd946b7fe1ab08.woff2',
  '128ada4ed8f3427036044a1b.webp',
  '15cef7a073bdb4eac36e6979.png',
  '1907d5a6c07a5792f3f1c999.png',
  '193df8aea82fbc08c4415c9a.webp',
  '1a6a77c1a0f4191234e453c7.webp',
  '1cf1f9b5ab6c036a4b5fe05c.webp',
  '1e614eeef47ea452961107f6.webp',
  '1f1a0170279e2be21c77f376.woff2',
  '25cc2416ce31d79d458503c2.png',
  '28269d3ffca7090b93a8b977.webp',
  '2866b872d7f4e2f335453292.webp',
  '292abe89382846e7641b433c.webp',
  '29ff88ca15a5df0855f8a8c7.png',
  '2e219e3a6b252a67925773c9.webp',
  '2f00b872393e32492abb2f17.webp',
  '30d8ebbf190bdcf3c2b63465.webp',
  '338fa1da0602ec07e57cee2f.webp',
  '35047971b898e9c6ce882dad.webp',
  '36aa7761e1ea325fdb0f7451.png',
  '37e11f637849a770373a3747.webp',
  '3c51a3e07739dae9c3cb1b57.webp',
  '3d72e40849b14029a7f4569e.woff2',
  '40f2e0876e016fbc94edd6b1.webp',
  '415659684125db18bf2a5dc2.webp',
  '431071dfea170cb2bbfefeca.png',
  '442fb97fe90a9996bbab6831.webp',
  '466d116007b3b5a0e775704c.png',
  '471766915ef51e7fa54fc4d0.woff2',
  '48abffd7970625710f7cdf06.webp',
  '4cc23cae82a2164a38c01121.webp',
  '4d9952bcf200e3c4177141d0.webp',
  '4eff640b8049a4ec855c4462.webp',
  '533183d25f448a1eaf4fc6d8.webp',
  '53d2a36027e28daf37ad7a32.png',
  '5478e737e8f0719eca5359db.webp',
  '54ada2e43a7497a3ca7d00cd.webp',
  '564d468f35d6772384324e55.webp',
  '56dba1818c0e3e8773c37fe8.png',
  '57cabac8de01b3ae4f5e8534.webp',
  '57da8aef6608f49d6919e8f1.webp',
  '5831b7da7b20e2032eca604c.png',
  '59eb220ebb712bbf46d6bc14.webp',
  '5b304fe2d6bf5ad671aec8b5.webp',
  '5d09b711fc025a3baf2dc642.woff2',
  '5da46be4bb88bc44beff6b1e.webp',
  '5fdce6dcba194436fbde944e.webp',
  '5fe054a7fd58d24bbc02d03a.webp',
  '60a919fe288b978f9dbe8c94.png',
  '61d4dfce5d02eb6c4cc8766d.webp',
  '64bd94f77fbf5e406046b296.png',
  '66043f6edc45244756feb9e6.webp',
  '664c1e12fbb84ec8fb57cd1a.woff2',
  '671c93b585a9a1e482a6aa11.png',
  '673e20bb6e7b02c9c9f4499b.webp',
  '688a08266f58abd89119eec8.webp',
  '69202160cdd7b5da4a7071e7.webp',
  '6f7cf3c75cc6cfdb53297cf3.webp',
  '71a7098ee455e48171be4908.webp',
  '72d15be0382d4d61577eb0fd.webp',
  '73aed8cef85fd21162e93449.webp',
  '7658ca1b1df8c73488fcd339.png',
  '77726eb5c8c4ac1797a441e5.webp',
  '786cb39d03a1e0df07ca81e0.webp',
  '7a7b56f17600b2ca4659a434.webp',
  '7a9fa1d67d67f85a7b699abe.webp',
  '7aa38d71f3cc8b9fd591cc78.woff2',
  '7af3445a2858fdd0b03e7ebd.webp',
  '7afa5ea866d2f47b098bc02e.webp',
  '7c03c53e9f660a488a3dfda7.webp',
  '7c40a18996ee7280b3e47cc0.png',
  '7c8afd058d8dce8cf308a9d7.woff2',
  '7e6f2a03e821115a846f9f8b.png',
  '7ea1dacc5c0677664324556c.webp',
  '85904297ce86f6ce2081c076.png',
  '86b61c975901dfc88d19be9a.webp',
  '87a4092538baa08e07e1de22.webp',
  '8ee5b0ee33a38482ec6d0377.webp',
  '8f43fc9e2987342549dc3be0.png',
  '8fd5479ea6155a5be72c979d.webp',
  '904dd47cf0387626cee63e7a.webp',
  '9176e2742ec9c50f627e3643.png',
  '9221227b3caa5a5db1ed3c38.webp',
  '93fb109e99e68b165971cea0.webp',
  '94a015d5c06953a145ff65c7.png',
  '99f8091d3ee51935dff533b2.webp',
  '9d08f522a4974f5c8247ef46.png',
  '9d09b86331c08444e769e200.webp',
  '9d0ea6ff2ea74cc012218998.webp',
  '9e70ffc05bc5c26e46b8af21.png',
  '9e9bed0f852e67003e59b65a.png',
  '9e9d5eb383f78498c778d3b5.webp',
  'a358c0dcb775ea61f71494c9.webp',
  'a3bd61239582ff941e38a114.webp',
  'a5541d8f0dbd2a3c357dc79d.png',
  'a5c514f700a274b051660632.woff2',
  'a74599565d0020558cddedbb.webp',
  'a770cf8e2931d53aa900c1c9.webp',
  'a8bf15e75a42190e09a2e56c.webp',
  'a8f725262fc69a4125c7d514.webp',
  'a9e3ec4219605a1e043ee991.webp',
  'ac7e62fdc1ee2f3e13738c7f.webp',
  'accb63fa67d73f6ac37c569e.woff2',
  'ad2d8949e658f770ed862e9d.webp',
  'ae60bd979a65f17f35d26dbd.png',
  'affcdb53ac16e025a1a4b261.webp',
  'b19c51813b086ebe87a58ae8.png',
  'b2e121050d3c8a05d17d669f.webp',
  'b3ffb3e072cc54bcf34e65fd.webp',
  'b41b8656fbd16d090b6e8689.png',
  'b55fa960a6bdde4b953cd234.webp',
  'bfc59cf8f93ec6c13ff93930.webp',
  'c005ec1cd290263ca56ced9d.webp',
  'c09ab7abdf7c3fe47f74ded1.webp',
  'c1b99b81d69d107b34ec3774.webp',
  'c31269f4bc5712b3ba13833d.png',
  'c3245615a0e0a24bb548e04d.webp',
  'c5113f98dc6e453207ee61ea.webp',
  'c5307a4f68f9e970acea8b20.webp',
  'c5d5e5c3655abd6c07be8960.png',
  'c677424c8bda0ed9a66d366d.png',
  'c9344354f585bf9a9e93f10a.webp',
  'c9cd0ee37e017ba3b580d19f.webp',
  'ca620aaa7913577ecf079b93.png',
  'cbf2f1fa71d56b9d1da0c28a.png',
  'cd00ce44aceee7841e7946c0.webp',
  'd3aec260d1c837d5a1c8b53a.png',
  'd4251597c62ae1c418a022e6.webp',
  'd466d116e7cf4b44b71d381c.webp',
  'd4811fda46d60eb1bc5c65f6.webp',
  'd527de7c0d1d46dcb649838d.webp',
  'd7c9b3d35ddc0aa5d97ab485.webp',
  'df71ea5e5729cca338603083.webp',
  'e114f9f606f7d7bcb2ac9e4a.webp',
  'e222e49e1abe4ebaf3151b21.webp',
  'e465b73bb30b07b40ad7c125.woff2',
  'e6135db81771b054e7c0b953.webp',
  'e68bf21e35e6230010a12870.png',
  'e6cbc06ee6dd32045f6374ad.woff2',
  'e7c9e1ede67351b2cb38920a.webp',
  'e9834df036972c8041c0bd59.webp',
  'ea15390997238b903adfe04a.webp',
  'eb2daf8f58727381e1089392.webp',
  'ebbe067f602dcb6dc41f051c.webp',
  'f01e2447429f2f144bc80d47.png',
  'f2750b4f2e323f9747076522.png',
  'f67c91d1c55dd2bfbc40f15c.webp',
  'f6dfe3da2b0f23f4d69c2fa4.webp',
  'f9d508a738b5b101112c2c08.woff2',
  'ff2b15ca7738ca68d15a649a.webp',
  'ffb6a029ae4b17d6007cbacb.png'
];
const assetRoot = new URL('ebooks/assets/', scope).href;
const files = new Set([
  ...shellFiles.map(file => new URL(file, scope).href),
  ...assetFiles.map(file => assetRoot + file)
]);
const total = files.size;

let snapshots;
let downloadJob;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function findSnapshots() {
  const names = (await caches.keys()).filter(name => name.startsWith(prefix) && name <= cacheName);
  const entries = await Promise.all(names.sort().reverse().map(async name => {
    const cache = await caches.open(name);
    return [name, cache, await isComplete(cache, name)];
  }));
  return entries.filter(([, , complete]) => complete);
}

function completeSnapshots() {
  if (!snapshots) {
    snapshots = findSnapshots().catch(() => {
      snapshots = undefined;
      return [];
    });
  }
  return snapshots;
}

async function cachedVersion(key) {
  for (const [, cache] of await completeSnapshots()) {
    const response = await cache.match(key);
    if (response) return response;
  }
}

function cachedResponse(key) {
  return cachedVersion(key).catch(() => undefined);
}

async function onlineOrSaved(request, key, immutable) {
  if (immutable) {
    const cached = await cachedResponse(key);
    if (cached) return cached;
  }

  try {
    const response = await fetch(request);
    return response.status < 500 ? response : (await cachedResponse(key)) || response;
  } catch (error) {
    const cached = await cachedResponse(key);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  const key = url.pathname === scope.pathname + 'index.html'
    ? scope.href
    : url.origin + url.pathname;
  const immutable = key.startsWith(assetRoot);
  if (files.has(key) || immutable) event.respondWith(onlineOrSaved(request, key, immutable));
});

async function missingFiles(cache) {
  const present = new Set((await cache.keys()).map(request => request.url));
  return [...files].filter(url => !present.has(url));
}

async function isComplete(cache, name) {
  const marker = await cache.match(readyKey);
  if (!marker) return false;
  if (name === cacheName) return (await missingFiles(cache)).length === 0;

  const previousFiles = await marker.json().catch(() => null);
  if (!Array.isArray(previousFiles) || !previousFiles.length) return false;
  const present = new Set((await cache.keys()).map(request => request.url));
  return previousFiles.every(url => present.has(url));
}

function statusMessage(ready, previousReady, completed) {
  return { type: 'OFFLINE_STATUS', ready, previousReady, completed, total };
}

async function offlineStatus() {
  const complete = await findSnapshots();
  if (complete.some(([name]) => name === cacheName)) return statusMessage(true, false, total);

  const pending = await caches.has(cacheName)
    ? await missingFiles(await caches.open(cacheName))
    : [...files];
  return statusMessage(false, complete.length > 0, total - pending.length);
}

function broadcast(job, payload) {
  job.lastMessage = payload;
  for (const port of job.ports) port.postMessage(payload);
}

async function saveOffline(job) {
  const cache = await caches.open(cacheName);
  if (await isComplete(cache, cacheName)) {
    broadcast(job, statusMessage(true, false, total));
    return;
  }

  const pending = await missingFiles(cache);
  job.completed = total - pending.length;
  const progress = () => broadcast(job, { type: 'OFFLINE_PROGRESS', completed: job.completed, total });
  progress();

  let next = 0;
  let failure;
  async function storeNext() {
    while (!failure && next < pending.length) {
      const url = pending[next++];
      try {
        const response = await fetch(url, { cache: 'reload', redirect: 'error' });
        if (response.status !== 200) throw new Error('Unable to cache ' + new URL(url).pathname);
        await cache.put(url, response);
        job.completed += 1;
        progress();
      } catch (error) {
        failure = error;
      }
    }
  }

  // Limit concurrent requests while allowing a later attempt to resume incomplete downloads.
  await Promise.all(Array.from({ length: Math.min(5, pending.length) }, storeNext));
  if (failure) throw failure;

  await cache.put(readyKey, new Response(JSON.stringify([...files])));
  snapshots = undefined;
  broadcast(job, statusMessage(true, false, total));

  // Retain one complete previous release for open readers during an update.
  try {
    const previous = (await completeSnapshots()).find(([name]) => name < cacheName)?.[0];
    const obsolete = (await caches.keys()).filter(name => (
      name.startsWith(prefix) && name < cacheName && name !== previous
    ));
    await Promise.all(obsolete.map(name => caches.delete(name)));
    snapshots = undefined;
  } catch (error) {
    console.warn('Could not remove the previous offline release.', error);
  }
}

function download(port) {
  if (downloadJob) {
    downloadJob.ports.add(port);
    if (downloadJob.lastMessage) port.postMessage(downloadJob.lastMessage);
    return downloadJob.promise;
  }

  const job = { ports: new Set([port]), completed: 0 };
  downloadJob = job;
  job.promise = saveOffline(job).catch(error => {
    console.warn('Could not save the eBooks offline.', error);
    broadcast(job, { type: 'OFFLINE_ERROR', completed: job.completed, total });
  }).finally(() => {
    downloadJob = undefined;
  });
  return job.promise;
}

self.addEventListener('message', event => {
  const port = event.ports[0];
  if (!port) return;

  if (event.data?.type === 'OFFLINE_STATUS') {
    event.waitUntil(offlineStatus().then(status => port.postMessage(status)).catch(() => {
      port.postMessage({ type: 'OFFLINE_ERROR', completed: 0, total });
    }));
  } else if (event.data?.type === 'OFFLINE_DOWNLOAD') {
    event.waitUntil(download(port));
  }
});
