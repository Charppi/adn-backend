import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1619605727628 implements MigrationInterface {
    name = 'Initial1619605727628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `pago` (`id` int NOT NULL AUTO_INCREMENT, `valor` int NOT NULL, `cargo` int NOT NULL, `total` int NOT NULL, `fechaPago` datetime NOT NULL, `desde` datetime NULL, `hasta` datetime NULL, `usuarioId` int NULL, `inmuebleId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `pago` ADD CONSTRAINT `FK_931ebb93af7144f3a1ef90662ad` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `pago` ADD CONSTRAINT `FK_433c7e586c98eaf70b918ca195b` FOREIGN KEY (`inmuebleId`) REFERENCES `inmueble`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `pago` DROP FOREIGN KEY `FK_433c7e586c98eaf70b918ca195b`");
        await queryRunner.query("ALTER TABLE `pago` DROP FOREIGN KEY `FK_931ebb93af7144f3a1ef90662ad`");
        await queryRunner.query("DROP TABLE `pago`");
    }

}
