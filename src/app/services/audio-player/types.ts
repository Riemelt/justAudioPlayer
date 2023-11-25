import { Audio } from '../../../data-sources/audio-table-data-source/types';

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

export type AudioPlayerResponse = {
  status: Status;
  error?: string;
  data?: Audio[];
};
