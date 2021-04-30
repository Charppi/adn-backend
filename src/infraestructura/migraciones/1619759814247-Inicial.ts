import {MigrationInterface, QueryRunner} from "typeorm";

export class Inicial1619759814247 implements MigrationInterface {
    name = 'Inicial1619759814247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `usuario` (`id` int NOT NULL AUTO_INCREMENT, `nombre` varchar(255) NOT NULL, `apellido` varchar(255) NOT NULL, `cedula` int NOT NULL, `fechaCreacion` datetime NOT NULL, UNIQUE INDEX `IDX_83ffe924cd2d60b07421bf8dfc` (`cedula`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `pago` (`id` int NOT NULL AUTO_INCREMENT, `valor` int NOT NULL, `cargo` int NOT NULL, `total` int NOT NULL, `fechaPago` datetime NOT NULL, `desde` datetime NULL, `hasta` datetime NULL, `usuarioId` int NULL, `inmuebleId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `inmueble` (`id` int NOT NULL AUTO_INCREMENT, `direccion` varchar(255) NOT NULL, `valor` int NOT NULL, `fechaAsignacion` datetime NOT NULL, `fechaInicioPago` datetime NULL, `fechaLimitePago` datetime NULL, `usuarioId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `pago` ADD CONSTRAINT `FK_931ebb93af7144f3a1ef90662ad` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `pago` ADD CONSTRAINT `FK_433c7e586c98eaf70b918ca195b` FOREIGN KEY (`inmuebleId`) REFERENCES `inmueble`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `inmueble` ADD CONSTRAINT `FK_cf7d00dd7d28463c3535fdbe92e` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `inmueble` DROP FOREIGN KEY `FK_cf7d00dd7d28463c3535fdbe92e`");
        await queryRunner.query("ALTER TABLE `pago` DROP FOREIGN KEY `FK_433c7e586c98eaf70b918ca195b`");
        await queryRunner.query("ALTER TABLE `pago` DROP FOREIGN KEY `FK_931ebb93af7144f3a1ef90662ad`");
        await queryRunner.query("DROP TABLE `inmueble`");
        await queryRunner.query("DROP TABLE `pago`");
        await queryRunner.query("DROP INDEX `IDX_83ffe924cd2d60b07421bf8dfc` ON `usuario`");
        await queryRunner.query("DROP TABLE `usuario`");
    }

}
