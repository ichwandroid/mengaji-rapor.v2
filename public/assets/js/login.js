const loginForm = document.querySelector("[data-login-form]");
const emailInput = document.querySelector("[data-login-email]");
const submitButton = document.querySelector("[data-login-submit]");
const loginStatus = document.querySelector("[data-login-status]");
const pocketBaseUrl = `${window.location.protocol}//${window.location.hostname}:8090`;
const authCollection = "users";

function setLoginStatus(message, tone = "info") {
  if (!loginStatus) return;

  loginStatus.textContent = message;
  loginStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/60");
  loginStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/60"
  );
}

function setFormLoading(isLoading) {
  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.classList.toggle("cursor-wait", isLoading);
  submitButton.classList.toggle("opacity-70", isLoading);
  
  if (emailInput) emailInput.disabled = isLoading;
}

if (loginForm && window.PocketBase) {
  const pb = new PocketBase(pocketBaseUrl);

  const handleSuccess = (authData) => {
    setLoginStatus(`Login berhasil. Selamat datang, ${authData.record.name || authData.record.email}.`, "success");
    window.setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = emailInput?.value || "";
    
    if (!email) {
      setLoginStatus("Email atau username harus diisi.", "error");
      return;
    }

    setFormLoading(true);
    setLoginStatus("Sedang masuk...");

    // 1. Coba login dengan password guru biasa
    pb.collection(authCollection)
      .authWithPassword(email, "ansal123")
      .then((authData) => {
        handleSuccess(authData);
      })
      .catch(() => {
        // 2. Jika gagal, coba login dengan password Admin
        pb.collection(authCollection)
          .authWithPassword(email, "4n4k54l3H")
          .then((authData) => {
            handleSuccess(authData);
          })
          .catch((error) => {
            console.error("Login gagal:", error);
            setLoginStatus("Akun tidak ditemukan atau belum didaftarkan.", "error");
            setFormLoading(false);
          });
      });
  });
} else if (loginForm) {
  setLoginStatus("SDK PocketBase belum termuat. Coba refresh halaman.", "error");
}
