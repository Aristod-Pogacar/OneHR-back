import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { Leave } from 'src/leave/entities/leave.entity';
import { LeaveService } from 'src/leave/leave.service';

@Injectable()
export class TaskScheduler {

    constructor(
        private readonly leaveService: LeaveService,
        private readonly taskService: TaskService,
        @InjectRepository(Employee)
        private readonly employeeRepo: Repository<Employee>,
        @InjectRepository(Leave)
        private readonly leaveRepo: Repository<Leave>,
    ) { }

    @Cron('0 37 15 * * *') // tous les jours à 21h
    // @Cron('10 * * * * *') // tous les jours à 21h
    async runTasks() {
        // console.log("TEST Scheduling");
        // const leaves = await this.leaveService.findLeavesNotDone();
        // leaves.forEach(async (leave) => {
        //     if (leave.employee) {
        //         console.log(leave.employee.matricule);
        //     }
        // });

        await this.taskService.executePendingTasks();
    }

}