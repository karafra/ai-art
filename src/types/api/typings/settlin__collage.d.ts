declare module '@settlin/collage' {
    import { Canvas } from "canvas";
    interface Options {
        sources: any[];
        width: number;
        height: number;
        imageWidth: number;
        imageHeight?: number;
        spacing?: number;
        backgroundColor?: string;
        lines?: string[];
        textStyle?: {
            height?: number
        };
        header?: {
            height?: number
        }
    }
    export default function(options?: Options): Promise<Canvas>
}
