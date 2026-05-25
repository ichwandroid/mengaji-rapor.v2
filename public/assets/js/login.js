const loginWithGoogleButton = document.querySelector("[data-google-login]");
const loginStatus = document.querySelector("[data-login-status]");
const pocketBaseUrl = "http://127.0.0.1:8090";
const authCollection = "users";

function setLoginStatus(message, tone = "info") {
  if (!loginStatus) return;

  loginStatus.textContent = message;
  loginStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/60");
  loginStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/60"
  );
}

function setGoogleButtonLoading(isLoading) {
  if (!loginWithGoogleButton) return;

  loginWithGoogleButton.disabled = isLoading;
  loginWithGoogleButton.classList.toggle("cursor-wait", isLoading);
  loginWithGoogleButton.classList.toggle("opacity-70", isLoading);
}

if (loginWithGoogleButton && window.PocketBase) {
  const pb = new PocketBase(pocketBaseUrl);

  loginWithGoogleButton.addEventListener("click", () => {
    const authPopup = window.open("", "google_oauth", "width=520,height=720");

    setGoogleButtonLoading(true);
    setLoginStatus("Membuka login Google...");

    pb.collection(authCollection)
      .authWithOAuth2({
        provider: "google",
        scopes: ["email", "profile"],
        createData: {
          role: "-"
        },
        urlCallback: (url) => {
          if (authPopup) {
            authPopup.location.href = url;
            authPopup.focus();
            return;
          }

          window.location.href = url;
        }
      })
      .then((authData) => {
        setLoginStatus(`Login berhasil. Selamat datang, ${authData.record.name || authData.record.email}.`, "success");
        window.setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      })
      .catch((error) => {
        if (authPopup && !authPopup.closed) {
          authPopup.close();
        }

        console.error("Google OAuth login gagal:", error);
        const detail = error?.response?.message || error?.message || "Login Google belum berhasil.";
        setLoginStatus(`${detail} Pastikan PocketBase berjalan di ${pocketBaseUrl}.`, "error");
      })
      .finally(() => {
        setGoogleButtonLoading(false);
      });
  });
} else if (loginWithGoogleButton) {
  setLoginStatus("SDK PocketBase belum termuat. Coba refresh halaman.", "error");
}
