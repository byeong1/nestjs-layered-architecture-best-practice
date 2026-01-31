import { basename, dirname, resolve } from "path";

/**
 * 컨트롤러 파일 경로에서 Swagger API 태그(도메인)를 자동 추출
 *
 * @param currentDir - 컨트롤러의 __dirname
 * @returns Swagger 태그 문자열 (예: "/users", "/admin/users")
 *
 * @example
 * // src/modules/routes/users/users.controller.ts
 * @ApiTags(getSwaggerDomain(__dirname)) // → "/users"
 *
 * // src/modules/routes/admin/users/users.controller.ts
 * @ApiTags(getSwaggerDomain(__dirname)) // → "/admin/users"
 */
export function getSwaggerDomain(currentDir: string): string {
    let dir = currentDir;
    let swaggerDomain = "";

    while (true) {
        const folderName = basename(dir);

        if (folderName === "routes") {
            break;
        }

        if (folderName) {
            swaggerDomain = `/${folderName}${swaggerDomain}`;
        }

        dir = dirname(dir);

        /* 루트까지 도달했는지 확인 */
        if (dir === resolve(dir, "..")) {
            console.warn("routes 폴더를 찾을 수 없습니다.");
            break;
        }
    }

    return swaggerDomain;
}
