do_recompute_sol = true;
do_save_figure = true;

sys = hybrid.examples.BouncingBall();

% Solver Options
tspan = [0, 30];
jspan = [0, 400];
config = HybridSolverConfig('Refine', 12);

% Animation Options
animation_timestep = 0.2;
max_n_frames = 1000;

% Initial Conditions
h0 = 1;
v0 = 0;
x0 = [h0; v0];

if ~exist('sol', 'var') || do_recompute_sol
    sol = sys.solve(x0, tspan, jspan, config);
    disp(sol)
else
    warning('skipped computing solution')
end


%% Plot solution in  R^n
figure(1); clf

if do_save_figure
    video_file_name = 'my_video';
    compress_video = true;
    if compress_video
        video_writer = VideoWriter('video_file_name', 'Motion JPEG AVI');
        video_writer.Quality = 80;
    else
        % 'Uncompressed AVI' seems to play in Acrobat, Pympress, and Okular, 
        % but it is so large that it bogs down the PDF viewers.
        video_writer = VideoWriter('video_file_name', 'Uncompressed AVI');
    end
    % Set the playback rate.
    video_writer.FrameRate = 10;
    
    open(video_writer)
end

try
    % Compute the actual number of frames needed.
    animation_t_final = sol.t(end);
    n_frames = ceil(animation_t_final/animation_timestep);
    if n_frames >= max_n_frames
        warning('n_frames = %d >= max_n_frames = %d. Setting n_frames := max_n_frames.', n_frames, max_n_frames)
        n_frames = max_n_frames;
    end
    
    % Loop through the frames.
    for i_frame = 1:n_frames
        fprintf('Frame %d/%d\n', i_frame, n_frames)

        %%% Set the figure to be the given size (requires pwintz package)
        % pwintz.utils.setFigureSize(fig_width, fig_height)

        % Compute the current final time, for this frame.
        t_end = animation_timestep*i_frame;
    
        cla; % Clear axes
        
        restricted_sol = sol.restrictT([0, t_end]);
        plotPhase(restricted_sol)
        hold on

        % Set the limits manually so they don't update during the animation as
        % more or the trajectory is plotted.
        xlim([-0.1, 1.1])
        ylim([-6, 6])
    
        % Display the current plot so that we can see the animation in realtime.
        drawnow

        if do_save_figure
            % if i_frame == 1
            %     %%% Save the first frame to use as a thumbnail before the video plays (requires pwintz package)
            %     pwintz.utils.saveExampleFigure('3D_example_start', ...
            %         'width', fig_width, 'height', fig_height, ...
            %         'save_pdf', false, 'save_png_preview', false, 'save_png', true)
            % end
            % if i_frame == n_frames
            %     %%% Save the last frame to use as a thumbnail after the video plays (requires pwintz package)
            %     pwintz.utils.saveExampleFigure('3D_example_end', ...
            %         'width', fig_width, 'height', fig_height, ...
            %         'save_pdf', false, 'save_png_preview', false, 'save_png', true)
            % end

            frame = getframe(gcf);
            try
                writeVideo(video_writer,frame)
            catch 
                warning('Failed to write video frame.')
                break
            end
        end

    end
    if do_save_figure
        close(video_writer)
    end
catch 
    if do_save_figure
        close(video_writer)
    end
end 