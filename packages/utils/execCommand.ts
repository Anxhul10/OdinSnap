import { spawn } from 'child_process';

export const execCommand = (command:string) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {
      stdio: 'inherit',
      shell: true,
    });
    childProcess.on('error', (error) => {
      reject(error);
    });
    childProcess.on('exit', () => {
      resolve('operation successful !!');
    });
  });
};
