import { Controller, Get, Post, Param, UseGuards, Req, ParseIntPipe, Body } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming JWT guard path
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTutorialDto } from './dto/create-tutorial.dto';

@ApiTags('Tutorials')
@Controller('tutorials')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tutorial' })
  @ApiResponse({ status: 201, description: 'The tutorial has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tutorials' })
  @ApiResponse({ status: 200, description: 'List of all tutorials.' })
  findAll() {
    return this.tutorialsService.findAll();
  }

  @Get(':tutorialId')
  @ApiOperation({ summary: 'Get a specific tutorial by ID' })
  @ApiResponse({ status: 200, description: 'The tutorial details.' })
  @ApiResponse({ status: 404, description: 'Tutorial not found.' })
  findOne(@Param('tutorialId', ParseIntPipe) tutorialId: number) {
    return this.tutorialsService.findOne(tutorialId);
  }

  @Post('methods/:methodId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a method as complete for the user' })
  @ApiResponse({ status: 201, description: 'Method marked as complete.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  completeMethod(@Param('methodId', ParseIntPipe) methodId: number, @Req() req) {
    const userId = req.user.user_id;
    return this.tutorialsService.completeMethod(userId, methodId);
  }
}