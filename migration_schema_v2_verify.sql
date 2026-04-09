-- ================================================================
-- VERIFICA post-migration v2
-- Eseguire DOPO migration_schema_v2.sql
-- Controlla che: colonne nuove esistano, dati migrati, vecchie colonne droppate
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Verifica esistenza colonne jolly_11..21 (deve restituire 11 righe per tabella)
-- ----------------------------------------------------------------
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name IN ('dispositivi_benevento','dispositivi_avellino')
  AND column_name ~ '^jolly_(1[1-9]|2[01])$'
ORDER BY table_name, column_name;

-- ----------------------------------------------------------------
-- 2. Verifica colonne rinominate esistono (deve restituire 14 righe per tabella)
-- ----------------------------------------------------------------
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name IN ('dispositivi_benevento','dispositivi_avellino')
  AND column_name IN (
    'data_ultima_vse','esito_ultima_vse',
    'data_ultima_vsp','esito_ultima_vsp',
    'data_ultima_cq','esito_ultima_cq',
    'data_prossima_cq',
    'periodicita_mo','mo_2324','mo_2425','mo_2526'
  )
ORDER BY table_name, column_name;

-- ----------------------------------------------------------------
-- 3. Verifica colonne droppate NON esistono più (deve restituire 0 righe)
-- ----------------------------------------------------------------
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name IN ('dispositivi_benevento','dispositivi_avellino')
  AND column_name IN (
    'vse_2324','vsp_2324','cq_2324',
    'esito_verifica','esito_verifica_precedente',
    'periodicita_mp','mp_2324','mp_2425','mp_2526',
    'mo_2324_old','mo_2425_old',
    'data_prossima_mo','periodicita_mo_old'
  )
ORDER BY table_name, column_name;

-- ----------------------------------------------------------------
-- 4. Verifica migrazione dati: jolly_11..14 non tutti null (benevento)
--    Conta quante righe hanno almeno uno dei jolly nuovi valorizzato
-- ----------------------------------------------------------------
SELECT
  COUNT(*) FILTER (WHERE jolly_11 IS NOT NULL) AS jolly_11_valorizzati,
  COUNT(*) FILTER (WHERE jolly_12 IS NOT NULL) AS jolly_12_valorizzati,
  COUNT(*) FILTER (WHERE jolly_13 IS NOT NULL) AS jolly_13_valorizzati,
  COUNT(*) FILTER (WHERE jolly_14 IS NOT NULL) AS jolly_14_valorizzati,
  COUNT(*) FILTER (WHERE jolly_16 IS NOT NULL) AS jolly_16_valorizzati,
  COUNT(*) FILTER (WHERE jolly_17 IS NOT NULL) AS jolly_17_valorizzati,
  COUNT(*) FILTER (WHERE jolly_18 IS NOT NULL) AS jolly_18_valorizzati,
  COUNT(*) FILTER (WHERE jolly_19 IS NOT NULL) AS jolly_19_valorizzati,
  COUNT(*) FILTER (WHERE jolly_20 IS NOT NULL) AS jolly_20_valorizzati,
  COUNT(*) FILTER (WHERE jolly_21 IS NOT NULL) AS jolly_21_valorizzati,
  COUNT(*) AS totale_righe
FROM dispositivi_benevento;

-- ----------------------------------------------------------------
-- 5. Verifica rinomina mo_*: conta righe con mo_2324 valorizzato
--    Deve essere simile al conteggio di jolly_13 (stessa origine)
-- ----------------------------------------------------------------
SELECT
  COUNT(*) FILTER (WHERE mo_2324 IS NOT NULL) AS mo_2324_valorizzati,
  COUNT(*) FILTER (WHERE mo_2425 IS NOT NULL) AS mo_2425_valorizzati,
  COUNT(*) FILTER (WHERE mo_2526 IS NOT NULL) AS mo_2526_valorizzati,
  COUNT(*) FILTER (WHERE periodicita_mo IS NOT NULL) AS periodicita_mo_valorizzati
FROM dispositivi_benevento;

-- ----------------------------------------------------------------
-- 6. Campione dati: prime 3 righe con jolly_11 valorizzato
-- ----------------------------------------------------------------
SELECT codice, descrizione_classe, jolly_11, jolly_12, jolly_14, jolly_16
FROM dispositivi_benevento
WHERE jolly_11 IS NOT NULL
LIMIT 3;
