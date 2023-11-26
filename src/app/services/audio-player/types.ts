export type Audio = {
  id: number;
  name: string;
  src: string;
  filename: string;
  howl: Howl | null;
};

export type Status = 'idle' | 'failed' | 'loaded' | 'loading';
export type Direction = 'previous' | 'next';

export type FreesoundResponse = {
  count: number;
  results: {
    id: number;
    name: string;
    previews: {
      ['preview-hq-mp3']: string;
    };
  }[];
};
