# Mi Cuaderno Digital

Aplicación web progresiva (PWA) para gestión de clases y exámenes de autoescuela, diseñada para iPad con Apple Pencil.

## Características

- ✅ Gestión completa de alumnos
- ✅ Registro de sesiones (clases y exámenes)
- ✅ Firma digital con Apple Pencil
- ✅ Historial de sesiones
- ✅ Estadísticas y objetivos
- ✅ Exportación a PDF
- ✅ PWA con funcionamiento offline
- ✅ Optimizado para iPad

## Tecnología

- React 18
- TypeScript
- Tailwind CSS
- Vite
- LocalStorage (migrará a Supabase)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/
│   ├── students/
│   ├── sessions/
│   ├── signatures/
│   ├── statistics/
│   └── pdf/
├── services/
│   ├── storage.ts
│   ├── signatures.ts
│   └── pdf.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
├── pages/
├── App.tsx
└── main.tsx
```
