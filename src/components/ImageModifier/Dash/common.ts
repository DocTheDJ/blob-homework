import type { Canvas } from "fabric";
import type { Ref } from "vue";

export interface ICommonProps{
  canvas: Canvas|null
}

export enum DrawTypes{
  none,
  rectangle,
  line
}

export type AnyRef<T> = Ref<T, T>
