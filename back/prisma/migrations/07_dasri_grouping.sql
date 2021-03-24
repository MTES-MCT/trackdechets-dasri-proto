ALTER TABLE "default$default"."Bsdasri" ADD "regroupedOnBsdasriId" VARCHAR(40);
ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("regroupedOnBsdasriId") REFERENCES "default$default"."Bsdasri"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    
 