export enum LayerState {
    NONE,
    EFFECT,
    SETTING,
    MASK,
    LOADING
}
export enum eType {
    OFF,
    ON
}
export class MusicState {
    public static effectState: eType = eType.ON;
    public static musicState: eType = eType.ON;
}