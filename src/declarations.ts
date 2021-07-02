declare module '*.svg' {
  const content: any;
  export default content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare type LocalizedString = {
  ru: string,
  en: string,
  es?: string,
};
