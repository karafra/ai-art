export interface GoogleApiAuthResponse {
  kind: string;
  idToken: string;
  expiresIn: number;
  localId: string;
}

export interface WomboTaskIdResponse {
  created_at: string;
  generated_photo_keys: string;
  id: string;
  input_spec: string | null;
  photo_url_list: string[];
  result: string | null;
  state: WomboDreamTaskState;
  updated_at: string;
  user_id: string;
  token: string;
}

export interface IWomboDreamStyle {
  value: number;
  name: string;
}

export class WomboDreamStyle implements IWomboDreamStyle {
  public static readonly Styles: Map<string, WomboDreamStyle> = new Map<
    string,
    WomboDreamStyle
  >();
  public static readonly Synthwave = new WomboDreamStyle(1, 'Synthwave');
  public static readonly Ukiyoe = new WomboDreamStyle(2, 'Ukiyoe');
  public static readonly No_Style = new WomboDreamStyle(3, 'No_Style');
  public static readonly Steampunk = new WomboDreamStyle(4, 'Steampunk');
  public static readonly Fantasy_Art = new WomboDreamStyle(5, 'Fantasy_Art');
  public static readonly Vibrant = new WomboDreamStyle(6, 'Vibrant');
  public static readonly Hd = new WomboDreamStyle(7, 'Hd');
  public static readonly Pastel = new WomboDreamStyle(8, 'Pastel');
  public static readonly Psychic = new WomboDreamStyle(9, 'Psychic');
  public static readonly Dark_Fantasy = new WomboDreamStyle(10, 'Dark_fantasy');
  public static readonly Mystical = new WomboDreamStyle(11, 'Mystical');
  public static readonly Festive = new WomboDreamStyle(12, 'Festive');
  public static readonly Baroque = new WomboDreamStyle(13, 'Baroque');
  public static readonly Etching = new WomboDreamStyle(14, 'Etching');
  public static readonly S_Dali = new WomboDreamStyle(15, 'S_Dali');
  public static readonly Wuhtercuhler = new WomboDreamStyle(16, 'Wuhtercuhler');
  public static readonly Provenance = new WomboDreamStyle(17, 'Provenance');
  public static readonly Rose_Gold = new WomboDreamStyle(18, 'Rose_Gold');
  public static readonly Moonwalker = new WomboDreamStyle(19, 'Moonwalker');
  public static readonly Blacklight = new WomboDreamStyle(20, 'Blacklight');
  public static readonly Psychedelic = new WomboDreamStyle(21, 'Psychedelic');
  public static readonly Ghibli = new WomboDreamStyle(22, 'Ghibli');
  public static readonly Sureal = new WomboDreamStyle(23, 'Sureal');
  public static readonly Radioactive = new WomboDreamStyle(27, 'Radioactive');
  public static readonly Arcane = new WomboDreamStyle(28, 'Arcane');

  private constructor(
    public readonly value: number,
    public readonly name: string,
  ) {
    WomboDreamStyle.Styles.set(name, this);
  }

  public static get styles() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Map(Array.from(this.Styles, ([k, _]) => [k, k]));
  }

  public static getByName(name: string) {
    return this.Styles.get(name);
  }
}

export interface WomboDreamInputSpec {
  prompt: string;
  style: number;
  display_freq: number;
  input_image?: {
    mediastore_id: string;
    weight: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export type WomboDreamTaskState = 'pending' | 'failed' | 'completed';

export interface WomboDreamTaskResponse {
  createdAt: string;
  generated_photo_keys: string[];
  id: string;
  input_spec: WomboDreamInputSpec;
  photo_url_list: string[];
  premium: boolean;
  result: null;
  state: WomboDreamTaskState;
  updated_at: string;
  user_id: string;
  token: string;
}
