/*
  # Eliminar duplicados de la importacion de ejercicios de gimnasio

  La migracion 20260806060000 se ejecuto dos veces, duplicando los 866
  ejercicios importados. Se conserva la copia mas antigua de cada uno
  (mismo nombre + mismo image_url) y se borra la mas reciente.

  Solo afecta a filas con equipment/muscle definidos (los ejercicios
  importados del gimnasio); los 63 ejercicios originales de futbol no
  tienen esas columnas rellenas, asi que no se tocan.
*/

DELETE FROM exercises a
USING exercises b
WHERE a.equipment IS NOT NULL
  AND b.equipment IS NOT NULL
  AND a.name = b.name
  AND a.image_url = b.image_url
  AND a.created_at > b.created_at;
