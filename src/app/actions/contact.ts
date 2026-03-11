"use server";
export async function submitContactForm(formData: FormData) {
  console.log("Contact form submitted (Dummy)");
  return {
    success: true,
    message: "お問い合わせを受け付けました（ダミー）"
  };
}
