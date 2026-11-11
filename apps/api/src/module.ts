import {
  Module,
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from "@nestjs/common";
import {
  IsIn,
  IsString,
  MaxLength,
  MinLength,
  validateSync,
} from "class-validator";
import { plainToInstance } from "class-transformer";
class ResultDto {
  @IsString() @MinLength(1) @MaxLength(20) name!: string;
  @IsString()
  @IsIn([
    "EPLD", "EPLS", "EPHD", "EPHS", "EFLD", "EFLS", "EFHD", "EFHS",
    "IPLD", "IPLS", "IPHD", "IPHS", "IFLD", "IFLS", "IFHD", "IFHS",
  ])
  code!: string;
  @IsString() @MaxLength(40) flavor!: string;
}
// 이벤트 데모용 인메모리 저장: 서버 재시작 시 초기화됩니다.
const entries: { name: string; code: string; flavor: string }[] = [];
@Controller("results")
class ResultsController {
  @Post() save(@Body() body: unknown) {
    const dto = plainToInstance(ResultDto, body);
    if (validateSync(dto).length)
      throw new BadRequestException("Invalid result");
    entries.push({ name: dto.name, code: dto.code, flavor: dto.flavor });
    return { ok: true };
  }
  @Get("count") count() {
    return { total: entries.length };
  }
  @Get("stats") stats() {
    return {
      total: entries.length,
      types: entries.reduce<Record<string, number>>((a, e) => {
        a[e.code] = (a[e.code] || 0) + 1;
        return a;
      }, {}),
    };
  }
}
@Module({ controllers: [ResultsController] })
export class AppModule {}
