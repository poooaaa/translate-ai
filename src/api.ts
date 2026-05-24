export async function callGoogleTranslateAPI(
  text: string,
  from: string,
  to: string
): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
    text
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API Error: ${response.status}`);
    }

    const result = await response.json();
    // Menggabungkan potongan hasil terjemahan jika teks panjang
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result[0].map((part: any[]) => part[0]).join('');
  } catch (error) {
    console.error('Gagal menggunakan Google Translate:', error);
    return 'Gagal menerjemahkan. Silakan coba lagi.';
  }
}
