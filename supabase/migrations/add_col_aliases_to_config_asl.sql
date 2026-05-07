-- Aggiunge colonna col_aliases alla tabella config_asl
-- Usata per rinominare le colonne standard nella UI per ogni ASL

ALTER TABLE config_asl
  ADD COLUMN IF NOT EXISTS col_aliases jsonb;
