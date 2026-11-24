(() => {
  'use strict';

  const save = document.getElementById('offline-save');
  const status = document.getElementById('offline-status');
  const progress = document.getElementById('offline-progress');
  const onlineLibrary = document.getElementById('online-library');
  const serviceWorker = navigator.serviceWorker;
  if (navigator.standalone || matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('install-help').hidden = true;
  }
  if (!serviceWorker) {
    status.textContent = '오프라인 저장을 이용하려면 Safari 또는 Chrome에서 책장을 열어 주세요.';
    return;
  }

  let saved = null;
  let failure = '';
  let checking = false;
  let downloading = false;

  async function request(type, onProgress) {
    const { active } = await serviceWorker.ready;
    const channel = new MessageChannel();
    return new Promise((resolve, reject) => {
      let timeout;

      function finish(error, result) {
        clearTimeout(timeout);
        channel.port1.close();
        if (error) reject(error);
        else resolve(result);
      }

      function waitForResponse() {
        clearTimeout(timeout);
        timeout = setTimeout(() => finish(new Error('Offline worker timed out')), 60000);
      }

      channel.port1.onmessage = ({ data }) => {
        if (data.type === 'OFFLINE_PROGRESS') {
          waitForResponse();
          onProgress?.(data);
        } else if (data.type === 'OFFLINE_STATUS') {
          finish(null, data);
        } else if (data.type === 'OFFLINE_ERROR') {
          finish(new Error('Offline download failed'));
        }
      };
      channel.port1.onmessageerror = () => finish(new Error('Offline worker message could not be read'));

      waitForResponse();
      try {
        active.postMessage({ type }, [channel.port2]);
      } catch (error) {
        channel.port2.close();
        finish(error);
      }
    });
  }

  function renderStatus() {
    onlineLibrary.hidden = !navigator.onLine;
    save.disabled = checking || downloading || !saved || saved.ready || !navigator.onLine;
    if (downloading) {
      save.textContent = '저장 중';
      status.textContent = '수업사례집 세 권을 저장하고 있습니다. 완료될 때까지 이 화면을 열어 두세요.';
      return;
    }

    save.textContent = saved?.ready ? '저장 완료' : '오프라인 저장';
    if (saved?.ready) {
      status.textContent = '세 권을 이 기기에 저장했습니다. 인터넷 없이 읽을 수 있습니다.';
    } else if (failure) {
      status.textContent = failure;
    } else if (checking) {
      status.textContent = '저장 기능을 확인하는 중입니다.';
    } else if (!navigator.onLine) {
      status.textContent = saved?.previousReady
        ? '이전에 저장한 세 권을 인터넷 없이 읽을 수 있습니다.'
        : '인터넷에 연결한 뒤 오프라인 저장을 눌러 주세요.';
    } else if (saved?.previousReady) {
      status.textContent = '이전에 저장한 책을 읽을 수 있습니다. 다시 저장하면 최신 책을 받을 수 있습니다.';
    } else {
      status.textContent = '인터넷에 연결된 상태에서 세 권을 한 번 저장하세요.';
    }
  }

  async function checkSaved() {
    if (checking || downloading) return;
    checking = true;
    failure = '';
    renderStatus();

    try {
      const registration = await serviceWorker.getRegistration();
      if (!registration?.active) {
        await serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      }
      saved = await request('OFFLINE_STATUS');
    } catch {
      failure = '저장 기능을 불러오지 못했습니다. 인터넷에 연결하고 새로고침해 주세요.';
    } finally {
      checking = false;
      renderStatus();
    }
  }

  save.addEventListener('click', async () => {
    if (save.disabled) return;
    downloading = true;
    failure = '';
    progress.hidden = false;
    progress.removeAttribute('value');
    renderStatus();
    navigator.storage?.persist?.().catch(() => {});

    try {
      saved = await request('OFFLINE_DOWNLOAD', ({ completed, total }) => {
        progress.max = total;
        progress.value = completed;
      });
    } catch {
      failure = saved?.previousReady
        ? '최신 책을 저장하지 못했습니다. 이전에 저장한 책은 계속 읽을 수 있습니다.'
        : '저장이 중단됐습니다. 인터넷에 연결한 뒤 다시 저장해 주세요.';
    } finally {
      downloading = false;
      progress.hidden = true;
      renderStatus();
    }
  });

  serviceWorker.addEventListener('controllerchange', checkSaved);
  window.addEventListener('online', checkSaved);
  window.addEventListener('offline', renderStatus);
  window.addEventListener('pageshow', event => {
    if (event.persisted) checkSaved();
  });
  checkSaved();
})();
