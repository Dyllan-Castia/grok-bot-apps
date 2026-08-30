import * as Clipboard from 'expo-clipboard';

export async function copyPayoutText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  await Clipboard.setStringAsync(text);
}

export async function sharePayoutText(text: string): Promise<'shared' | 'copied'> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  if (nav && typeof nav.share === 'function') {
    try {
      await nav.share({ title: 'Tip Split', text });
      return 'shared';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return 'shared';
      }
    }
  }

  await copyPayoutText(text);
  return 'copied';
}
