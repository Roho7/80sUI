export type ShaderMotionParams = { speed?: number; frame?: number; fps?: number }

export type ShaderColorParam = string

export type ShaderUniformValue = number | boolean | readonly number[]

export type ShaderMountUniforms = Record<string, ShaderUniformValue>

export type ShaderMountColors = Record<string, ShaderColorParam>

export type ShaderPreset<Params> = { name: string; params: Params }
