import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, RouteStatusType } from "src/generated/prisma/client";

@Injectable()
export class ListRoutesRepository {
  constructor(private prismaService: PrismaService) {}

  async findCompaniesByRoute(query: { origin: string; destination: string }) {
    try {
      return await this.prismaService.route.findMany({
        where: {
          origin: {
            equals: query.origin,
            mode: "insensitive",
          },
          destination: {
            equals: query.destination,
            mode: "insensitive",
          },
          status: RouteStatusType.ACTIVE,
        },
        select: {
          routeNumber: true,
          origin: true,
          destination: true,
          price: true,
          departureLocation: true,
          arrivalLocation: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      throw error;
    }

    throw error;
  }
}
