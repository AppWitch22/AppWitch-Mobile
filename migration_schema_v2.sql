-- ================================================================
-- MIGRATION v2 — Ristrutturazione schema dispositivi
-- Da eseguire su ENTRAMBE le tabelle: dispositivi_benevento e dispositivi_avellino
-- ================================================================

-- ----------------------------------------------------------------
-- FASE 1: Aggiungi colonne jolly_11..jolly_21
-- ----------------------------------------------------------------
ALTER TABLE dispositivi_benevento
  ADD COLUMN IF NOT EXISTS jolly_11 text,
  ADD COLUMN IF NOT EXISTS jolly_12 text,
  ADD COLUMN IF NOT EXISTS jolly_13 text,
  ADD COLUMN IF NOT EXISTS jolly_14 text,
  ADD COLUMN IF NOT EXISTS jolly_15 text,
  ADD COLUMN IF NOT EXISTS jolly_16 text,
  ADD COLUMN IF NOT EXISTS jolly_17 text,
  ADD COLUMN IF NOT EXISTS jolly_18 text,
  ADD COLUMN IF NOT EXISTS jolly_19 text,
  ADD COLUMN IF NOT EXISTS jolly_20 text,
  ADD COLUMN IF NOT EXISTS jolly_21 text;

ALTER TABLE dispositivi_avellino
  ADD COLUMN IF NOT EXISTS jolly_11 text,
  ADD COLUMN IF NOT EXISTS jolly_12 text,
  ADD COLUMN IF NOT EXISTS jolly_13 text,
  ADD COLUMN IF NOT EXISTS jolly_14 text,
  ADD COLUMN IF NOT EXISTS jolly_15 text,
  ADD COLUMN IF NOT EXISTS jolly_16 text,
  ADD COLUMN IF NOT EXISTS jolly_17 text,
  ADD COLUMN IF NOT EXISTS jolly_18 text,
  ADD COLUMN IF NOT EXISTS jolly_19 text,
  ADD COLUMN IF NOT EXISTS jolly_20 text,
  ADD COLUMN IF NOT EXISTS jolly_21 text;

-- ----------------------------------------------------------------
-- FASE 2: Migrazione dati nelle nuove colonne jolly
-- ----------------------------------------------------------------
UPDATE dispositivi_benevento SET
  jolly_11 = vse_2324,
  jolly_12 = vsp_2324,
  jolly_13 = mo_2324,
  jolly_14 = cq_2324,
  jolly_16 = esito_verifica,
  jolly_17 = esito_verifica_precedente,
  jolly_18 = mo_2425,
  jolly_19 = mo_2526,
  jolly_20 = data_prossima_mo,
  jolly_21 = periodicita_mo;

UPDATE dispositivi_avellino SET
  jolly_11 = vse_2324,
  jolly_12 = vsp_2324,
  jolly_13 = mo_2324,
  jolly_14 = cq_2324,
  jolly_16 = esito_verifica,
  jolly_17 = esito_verifica_precedente,
  jolly_18 = mo_2425,
  jolly_19 = mo_2526,
  jolly_20 = data_prossima_mo,
  jolly_21 = periodicita_mo;

-- ----------------------------------------------------------------
-- FASE 3: Drop colonne che diventano jolly (senza conflitti di nome)
-- ----------------------------------------------------------------
ALTER TABLE dispositivi_benevento
  DROP COLUMN IF EXISTS vse_2324,
  DROP COLUMN IF EXISTS vsp_2324,
  DROP COLUMN IF EXISTS cq_2324,
  DROP COLUMN IF EXISTS esito_verifica,
  DROP COLUMN IF EXISTS esito_verifica_precedente;

ALTER TABLE dispositivi_avellino
  DROP COLUMN IF EXISTS vse_2324,
  DROP COLUMN IF EXISTS vsp_2324,
  DROP COLUMN IF EXISTS cq_2324,
  DROP COLUMN IF EXISTS esito_verifica,
  DROP COLUMN IF EXISTS esito_verifica_precedente;

-- Drop mo_* che liberano il nome per le rinominate da mp_*
ALTER TABLE dispositivi_benevento
  DROP COLUMN IF EXISTS periodicita_mo,
  DROP COLUMN IF EXISTS mo_2324,
  DROP COLUMN IF EXISTS mo_2425,
  DROP COLUMN IF EXISTS mo_2526,
  DROP COLUMN IF EXISTS data_prossima_mo;

ALTER TABLE dispositivi_avellino
  DROP COLUMN IF EXISTS periodicita_mo,
  DROP COLUMN IF EXISTS mo_2324,
  DROP COLUMN IF EXISTS mo_2425,
  DROP COLUMN IF EXISTS mo_2526,
  DROP COLUMN IF EXISTS data_prossima_mo;

-- ----------------------------------------------------------------
-- FASE 4: Rinomina colonne mp_* → mo_*
-- ----------------------------------------------------------------
ALTER TABLE dispositivi_benevento RENAME COLUMN periodicita_mp TO periodicita_mo;
ALTER TABLE dispositivi_benevento RENAME COLUMN mp_2324 TO mo_2324;
ALTER TABLE dispositivi_benevento RENAME COLUMN mp_2425 TO mo_2425;
ALTER TABLE dispositivi_benevento RENAME COLUMN mp_2526 TO mo_2526;

ALTER TABLE dispositivi_avellino RENAME COLUMN periodicita_mp TO periodicita_mo;
ALTER TABLE dispositivi_avellino RENAME COLUMN mp_2324 TO mo_2324;
ALTER TABLE dispositivi_avellino RENAME COLUMN mp_2425 TO mo_2425;
ALTER TABLE dispositivi_avellino RENAME COLUMN mp_2526 TO mo_2526;

-- ----------------------------------------------------------------
-- FASE 5: Rinomina colonne VSE/VSP/CQ (data_ultima, esito_ultima)
-- ----------------------------------------------------------------
ALTER TABLE dispositivi_benevento RENAME COLUMN vse_2425 TO data_ultima_vse;
ALTER TABLE dispositivi_benevento RENAME COLUMN vse_2526 TO esito_ultima_vse;
ALTER TABLE dispositivi_benevento RENAME COLUMN vsp_2425 TO data_ultima_vsp;
ALTER TABLE dispositivi_benevento RENAME COLUMN vsp_2526 TO esito_ultima_vsp;
ALTER TABLE dispositivi_benevento RENAME COLUMN cq_2425 TO data_ultima_cq;
ALTER TABLE dispositivi_benevento RENAME COLUMN cq_2526 TO esito_ultima_cq;
ALTER TABLE dispositivi_benevento RENAME COLUMN data_prossimo_cq TO data_prossima_cq;

ALTER TABLE dispositivi_avellino RENAME COLUMN vse_2425 TO data_ultima_vse;
ALTER TABLE dispositivi_avellino RENAME COLUMN vse_2526 TO esito_ultima_vse;
ALTER TABLE dispositivi_avellino RENAME COLUMN vsp_2425 TO data_ultima_vsp;
ALTER TABLE dispositivi_avellino RENAME COLUMN vsp_2526 TO esito_ultima_vsp;
ALTER TABLE dispositivi_avellino RENAME COLUMN cq_2425 TO data_ultima_cq;
ALTER TABLE dispositivi_avellino RENAME COLUMN cq_2526 TO esito_ultima_cq;
ALTER TABLE dispositivi_avellino RENAME COLUMN data_prossimo_cq TO data_prossima_cq;
