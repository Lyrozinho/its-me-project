document.getElementById("activate").addEventListener("click", async () => {
  const key = document.getElementById("key").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const status = document.getElementById("status");
  if (!key || !pass) {
    status.textContent = "Preencha chave e senha.";
    return;
  }
  await chrome.storage.local.set({ licenseKey: key, licensePassword: pass });
  status.textContent = "Licença salva!";
});

(async () => {
  const { licenseKey } = await chrome.storage.local.get(["licenseKey"]);
  if (licenseKey) {
    document.getElementById("status").textContent = "Licença ativa.";
  }
})();
