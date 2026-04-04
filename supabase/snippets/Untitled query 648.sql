UPDATE peptide
SET category = CASE id
    WHEN '159ac07f-d457-4e55-b762-2caa6e796f39' THEN 'gh secretagogues' -- Hexarelin
    WHEN '2ed2e9bd-e831-4821-8006-6fa1e53bd385' THEN 'performance'      -- Melanotan II
    WHEN '36a8145e-ae60-4156-868a-d155dfe52923' THEN 'performance'      -- PT-141
    WHEN '4f927402-d0bf-48f9-b508-721043e69e8b' THEN 'gh secretagogues' -- CJC-1295
    WHEN '7e3bbc5e-44f0-4fc0-aec1-25099bf49861' THEN 'longevity'        -- test
    WHEN '7fe818d7-cd10-4735-973a-5e8f69d964b9' THEN 'gh secretagogues' -- GHRP-2
    WHEN '846022ff-5aa5-4a92-94a4-3f5289b11970' THEN 'gh secretagogues' -- Sermorelin
    WHEN 'a0d8a55b-a69f-4f00-b04b-093a9c7d685e' THEN 'longevity'        -- test morall lin
    WHEN 'c6c1da25-0b47-4508-84ea-4961708f92f1' THEN 'gh secretagogues' -- Ipamorelin
    WHEN 'c6f590d6-af09-4e95-98ec-8a1959888f45' THEN 'healing'          -- TB-500
    WHEN 'cf346db1-a4d4-4e90-b709-1f6cfbfa53a2' THEN 'gh secretagogues' -- MK-677
    WHEN 'da2dbd4c-3591-4b69-99cd-006989b18fbf' THEN 'healing'          -- BPC-157
    WHEN 'e6662e14-01ce-4463-ae91-c1bf7c8f684c' THEN 'longevity'        -- another testq
    WHEN 'f799ec25-ec72-4e3f-8809-d7ca3614bf78' THEN 'gh secretagogues' -- GHRP-6
END
WHERE id IN (
'159ac07f-d457-4e55-b762-2caa6e796f39',
'2ed2e9bd-e831-4821-8006-6fa1e53bd385',
'36a8145e-ae60-4156-868a-d155dfe52923',
'4f927402-d0bf-48f9-b508-721043e69e8b',
'7e3bbc5e-44f0-4fc0-aec1-25099bf49861',
'7fe818d7-cd10-4735-973a-5e8f69d964b9',
'846022ff-5aa5-4a92-94a4-3f5289b11970',
'a0d8a55b-a69f-4f00-b04b-093a9c7d685e',
'c6c1da25-0b47-4508-84ea-4961708f92f1',
'c6f590d6-af09-4e95-98ec-8a1959888f45',
'cf346db1-a4d4-4e90-b709-1f6cfbfa53a2',
'da2dbd4c-3591-4b69-99cd-006989b18fbf',
'e6662e14-01ce-4463-ae91-c1bf7c8f684c',
'f799ec25-ec72-4e3f-8809-d7ca3614bf78'
);