import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.menu.count();
  if (count > 0) {
    console.log("이미 데이터가 있어 시드를 건너뜁니다.");
    return;
  }

  const menu1 = await prisma.menu.create({
    data: {
      name: "Spicy Tofu Soup",
      nameKo: "매운 두부찌개",
      category: "메인",
      sortOrder: 0,
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      name: "Kimchi Fried Rice",
      nameKo: "김치볶음밥",
      category: "메인",
      sortOrder: 1,
    },
  });

  await prisma.recipe.create({
    data: {
      menuId: menu1.id,
      servings: 2,
      description: "간단히 끓이는 매운 두부찌개입니다.",
      ingredients: {
        create: [
          { name: "두부", amount: "1모", sortOrder: 0 },
          { name: "대파", amount: "1대", sortOrder: 1 },
          { name: "고춧가루", amount: "1큰술", sortOrder: 2 },
          { name: "다진 마늘", amount: "1작은술", sortOrder: 3 },
          { name: "국간장", amount: "1큰술", sortOrder: 4 },
        ],
      },
      steps: {
        create: [
          { stepOrder: 0, content: "냄비에 물 2컵을 붓고 끓인다." },
          { stepOrder: 1, content: "고춧가루, 다진 마늘, 국간장을 넣고 풀어준다." },
          { stepOrder: 2, content: "두부를 넣고 2~3분 끓인다." },
          { stepOrder: 3, content: "대파를 넣고 1분 더 끓인 후 불을 끈다." },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      menuId: menu2.id,
      servings: 1,
      description: "남은 김치로 만드는 김치볶음밥.",
      ingredients: {
        create: [
          { name: "밥", amount: "1공기", sortOrder: 0 },
          { name: "김치", amount: "1/2컵", sortOrder: 1 },
          { name: "대파", amount: "약간", sortOrder: 2 },
          { name: "참기름", amount: "1작은술", sortOrder: 3 },
          { name: "통깨", amount: "약간", sortOrder: 4 },
        ],
      },
      steps: {
        create: [
          { stepOrder: 0, content: "김치는 적당히 잘라 둔다." },
          { stepOrder: 1, content: "팬에 기름을 두르고 김치를 볶는다." },
          { stepOrder: 2, content: "밥을 넣고 골고루 섞어 볶는다." },
          { stepOrder: 3, content: "참기름과 대파, 통깨를 넣고 한 번 더 섞는다." },
        ],
      },
    },
  });

  console.log("Seed 완료: 메뉴 2개, 레시피 2개");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
