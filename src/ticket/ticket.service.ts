import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WalletTransactionService } from "src/wallet-transaction/wallet-transaction.service";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";

@Injectable()
export class TicketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletTransactionService: WalletTransactionService
  ) {}

  async findManyByUserAndStatus(userId: string, status: TicketStatusType) {
    return this.prismaService.ticket.findMany({
      where: {
        userId,
        status,
      },
      select: {
        id: true,
        purchasePrice: true,
        status: true,
        purchaseAt: true,
        usedAt: true,
        route: {
          select: {
            routeNumber: true,
            origin: true,
            destination: true,
            price: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.ticket.findUnique({
      where: { id },
      select: {
        id: true,
        purchasePrice: true,
        status: true,
        purchaseAt: true,
        usedAt: true,
        route: {
          select: {
            routeNumber: true,
            origin: true,
            destination: true,
            price: true,
          },
        },
      },
    });
  }

  async purchase(userId: string, purchaseData: PurchaseTicketDto) {
    const balance = await this.walletTransactionService.getBalance(userId);

    if (balance < purchaseData.purchasePrice) {
      throw new BadRequestException("Insufficient balance");
    }

    try {
      const purchaseAt = new Date();

      const expiresAt = new Date(purchaseAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      return await this.prismaService.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(purchaseData.purchasePrice),
          transactionType: "WITHDRAWAL",
          ticket: {
            create: {
              userId: userId,
              routeId: purchaseData.routeId,
              purchasePrice: new Prisma.Decimal(purchaseData.purchasePrice),
              purchaseAt: purchaseAt,
              expiresAt: expiresAt,
            },
          },
        },
        select: {
          transactionAmount: true,
          ticket: {
            select: {
              status: true,
              expiresAt: true,
              route: {
                select: {
                  origin: true,
                  destination: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new BadRequestException("User or route not found");
      }

      throw error;
    }
  }

  private isForeignKeyError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
  }
}
