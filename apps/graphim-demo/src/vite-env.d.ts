/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.vs' {
  const value: string;
  export default value;
}

declare module '*.fs' {
  const value: string;
  export default value;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}
