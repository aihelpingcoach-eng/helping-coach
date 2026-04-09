# Configuración de IA

## Resumen

La aplicación utiliza inteligencia artificial a través de Anthropic Claude para potenciar los coaches virtuales y el análisis de jugadores. La API Key se gestiona de forma **completamente segura** en el backend, nunca en el frontend.

## Arquitectura de Seguridad

- ✅ La API Key se lee exclusivamente desde la variable de entorno `AI_API_KEY`
- ✅ La API Key NUNCA está expuesta en el código del frontend
- ✅ Todas las llamadas de IA pasan por una Edge Function de Supabase
- ✅ Se utiliza autenticación JWT para proteger el acceso
- ✅ Modo mock automático cuando no hay API Key configurada

## Configuración de la API Key

### Opción 1: Dashboard de Supabase (Recomendado)

1. Ve al Dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Edge Functions** → **Secrets**
4. Agrega un nuevo secreto:
   - Nombre: `AI_API_KEY`
   - Valor: Tu API Key de Anthropic (obtener en https://console.anthropic.com)
5. Guarda los cambios

Los secretos están disponibles automáticamente para todas las Edge Functions.

### Opción 2: CLI de Supabase (Desarrollo Local)

```bash
supabase secrets set AI_API_KEY=tu_api_key_aqui
```

## Obtener una API Key de Anthropic

1. Crea una cuenta en https://console.anthropic.com
2. Ve a **API Keys**
3. Genera una nueva API Key
4. Copia la key y configúrala siguiendo los pasos anteriores

## Coaches Disponibles

El sistema incluye 5 tipos de coaches IA:

1. **Helpin Coach** (`helpin_coach`) - Experto en táctica y alineaciones
2. **Nursing Coach** (`nursing_coach`) - Especialista en lesiones y recuperación
3. **Training Coach** (`training_coach`) - Preparador físico de alto rendimiento
4. **Player Analysis** (`player_analysis`) - Analiza jugadores y determina PlayStyles
5. **Player Progression** (`player_progression`) - Evalúa progresión de jugadores

## Modo de Desarrollo

Si no configuras la API Key, la aplicación funciona en **modo prueba**:
- Se muestra el mensaje: "IA en modo prueba"
- Las respuestas son simuladas
- No se consumen créditos de API

## Gestión de Errores

El sistema maneja errores de forma amigable:
- Si la IA no está disponible: "El coach no está disponible ahora mismo. Inténtalo de nuevo."
- No se exponen detalles técnicos al usuario
- Los errores se registran en la consola para debugging

## Seguridad

- ✅ La API Key NUNCA llega al navegador del usuario
- ✅ Todas las peticiones están autenticadas con JWT
- ✅ Solo usuarios autenticados pueden usar la IA
- ✅ Rate limiting aplicado automáticamente por Supabase
- ✅ CORS correctamente configurado

## Estructura Técnica

```
Frontend (src/utils/ai.ts)
    ↓ (Autenticado con JWT)
Supabase Edge Function (ai-service)
    ↓ (Con AI_API_KEY)
API de Anthropic
```

## Costos

La API de Anthropic usa el modelo **Claude 3.5 Sonnet**:
- Entrada: ~$3 por millón de tokens
- Salida: ~$15 por millón de tokens

Promedio estimado por consulta:
- Chat con coach: ~$0.01 - $0.02
- Análisis de jugador: ~$0.005 - $0.01

## Soporte

Para problemas con la configuración:
1. Verifica que la variable `AI_API_KEY` esté configurada en Supabase
2. Comprueba que tu API Key de Anthropic sea válida
3. Revisa los logs en el Dashboard de Supabase → Edge Functions
