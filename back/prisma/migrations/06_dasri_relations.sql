ALTER TABLE "default$default"."Bsdasri" 
ADD "emissionSignatoryId" VARCHAR(40),
ADD "transportSignatoryId" VARCHAR(40),
ADD "receptionSignatoryId" VARCHAR(40),
ADD "operationSignatoryId" VARCHAR(40);


ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("emissionSignatoryId")REFERENCES "default$default"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    
ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("transportSignatoryId")REFERENCES "default$default"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 
ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("receptionSignatoryId")REFERENCES "default$default"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "default$default"."Bsdasri" ADD FOREIGN KEY("operationSignatoryId")REFERENCES "default$default"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
