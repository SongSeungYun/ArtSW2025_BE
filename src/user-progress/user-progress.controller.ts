// Path: src/user-progress/user-progress.controller.ts

import { Controller, Get, Patch, Param, Req, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserProgressService } from './user-progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';

@ApiTags('User Progress')
@Controller('user-progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall user progress' })
  @ApiResponse({ status: 200, description: 'Returns overall progress summary.' })
  async getOverallProgress(@Req() req) {
    const userId = req.user.user_id;
    return this.userProgressService.getOverallProgress(userId);
  }

  @Get('methods/:methodId')
  @ApiOperation({ summary: 'Get specific method progress for the user' })
  @ApiResponse({ status: 200, description: 'Returns progress for a specific method.' })
  @ApiResponse({ status: 404, description: 'Progress not found.' })
  async getMethodProgress(
    @Param('methodId', ParseIntPipe) methodId: number,
    @Req() req,
  ) {
    const userId = req.user.user_id;
    return this.userProgressService.getMethodProgress(userId, methodId);
  }

  @Patch('methods/:methodId')
  @ApiOperation({ summary: 'Update specific method progress for the user' })
  @ApiResponse({ status: 200, description: 'Updated progress for the method.' })
  @ApiResponse({ status: 404, description: 'Progress not found.' })
  async updateMethodProgress(
    @Param('methodId', ParseIntPipe) methodId: number,
    @Body() updateDto: UpdateUserProgressDto,
    @Req() req,
  ) {
    const userId = req.user.user_id;
    return this.userProgressService.updateMethodProgress(userId, methodId, updateDto);
  }
}

