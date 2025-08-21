import type { Canvas } from "fabric";
import { inject, type Ref } from "vue";

export interface ICommonProps{
  canvas: Canvas|null
}

export enum DrawTypes{
  none,
  rectangle,
  line
}

export enum Providing{
  canvas = "canvas",
  drawing = "drawing"
}

export type AnyRef<T> = Ref<T, T>

export const useCanvas = () => inject<Ref<Canvas | null>>(Providing.canvas)!;
export const useDrawing = () => inject<Ref<DrawTypes>>(Providing.drawing)!;
