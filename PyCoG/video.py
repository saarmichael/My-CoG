import json
import mne
from mne_bids import BIDSPath, read_raw_bids
from matplotlib import animation, pyplot as plt
from moviepy.editor import ImageSequenceClip
import mne_bids
import os
from pyvis.network import Network
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import networkx as nx

from coherence import coherence

def get_bids_path():
        file_name = r"D:\Users\user\Desktop\biu\cs\Year C\Project\final_project\My-CoG-1\PyCoG\users_data\bids\sub-01\ses-iemu\ieeg\sub-01_ses-iemu_task-film_acq-clinical_run-1_ieeg.eeg"
        # get rid of the .eeg suffix
        file_name = file_name.split(".")[0]
        bids_path = mne_bids.get_bids_path_from_fname(file_name)
        return bids_path

        

def plot_video(raw, epoch_duration):
     # Number of samples per epoch
    epoch_samples = int(epoch_duration * raw.info['sfreq'])

    # Create directory for frames
    if not os.path.isdir("frames"):
        os.mkdir("frames")

    # Create a list to store the frames
    frames = []

    # Create the epochs manually and plot each epoch
    for i in range(0, len(raw.times) - 1, epoch_samples):
        if raw.times[i] + epoch_duration > raw.tmax / 2:
            break
        epoch = raw.copy().crop(tmin=raw.times[i], tmax=raw.times[i] + epoch_duration)
        fig = epoch.plot(show=False)
        plt.savefig(f"frames/frame_{i//epoch_samples:03d}.png", dpi=300)  # save epochs as frames
        plt.close(fig)
        frames.append(f"frames/frame_{i//epoch_samples:03d}.png")

    # Create a video from the frames using moviepy
    clip = ImageSequenceClip(frames, fps=12)  # Set FPS (frames per second) according to your needs
    clip.write_videofile("my_animation.mp4", codec='mpeg4')
    # Clean up frames directory
    for frame in frames:
        os.remove(frame)



raw = mne_bids.read_raw_bids(bids_path=get_bids_path(), verbose=False)
# Duration of each epoch in seconds
epoch_duration = 3

tsv_path = (
            get_bids_path()
            .copy()
            .update(suffix="channels", extension=".tsv")
            .fpath
                )
tsv_table = pd.read_table(tsv_path)
# get a list of the sampling rates
fs= tsv_table["sampling_frequency"].tolist()[0]

window = 'hann'

# Number of channels
n_channels = len(raw.ch_names) // 8


data = raw.get_data()

# Calculate the number of samples in each 0.5 second chunk
n_samples_epoch = int(fs * epoch_duration)

# Get the total number of epochs
n_epochs = data.shape[1] // n_samples_epoch

# Initialize an empty connectivity matrix
con = np.zeros((n_channels, n_channels, n_epochs))

# Calculate coherence for each pair of channels
for epoch in range(n_epochs):
    start = epoch * n_samples_epoch
    end = start + n_samples_epoch
    for i in range(n_channels):
        for j in range(i+1, n_channels):
            f, Cxy = coherence(data[i, start:end], data[j, start:end], fs, window, epoch_duration)
            # get only beta band
            Cxy = Cxy[3:17]
            # We take the mean coherence across all frequencies as a summary statistic
            con[i, j, epoch] = np.mean(Cxy)
            con[j, i, epoch] = con[i, j, epoch]  # the coherence measure is symmetric
print('finished computing coherence')

# Set a threshold to define which connections are significant
threshold = np.percentile(con, 90)


frames = []
for fra in range(n_epochs):
    
    # Create a graph
    G = nx.Graph()
    nodes = raw.ch_names
    # Add edges with weight as label
    for i in range(n_channels):
        for j in range(i+1, n_channels):
            # Add nodes
            G.add_node(nodes[i])
            G.add_node(nodes[j])
            # Add edge with weight as label
            G.add_edge(nodes[i], nodes[j], weight=round(con[i, j, fra], 2))

    # Compute the layout
    pos = nx.circular_layout(G)

    # Create lists to store the edge coordinates and weights
    edge_x = []
    edge_y = []
    edge_weights = []
    # Initialize list to hold traces
    edge_traces = []
    # Create annotation trace for displaying edge weights
    annotation_trace = go.Scatter(
        x=[],
        y=[],
        text=[],
        mode='text',
        textposition='bottom center'
    )
        
    # Create edge trace with weights as text
    edge_trace = go.Scatter(x=[], y=[], line=dict(color='#888'), mode='lines')
    # Iterate over the edges and append coordinates and weights
    for edge in G.edges():
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_x.extend([x0, x1, None])
        edge_y.extend([y0, y1, None])
        weight = G[edge[0]][edge[1]]["weight"]
        # Create edge trace
        edge_trace = go.Scatter(
            x=[x0, x1], 
            y=[y0, y1], 
            mode='lines',
            line=dict(width=pow(8, weight), color='#888'), 
        )
        edge_traces.append(edge_trace)

        x = x0 * 0.7 + x1 * 0.3 
        y = y0 * 0.7 + y1 * 0.3
        annotation_trace['x'] += tuple([x])
        annotation_trace['y'] += tuple([y])
        annotation_trace['text'] += tuple([f'{weight}'])

    # Create node trace
    node_trace = go.Scatter(
        x=[],
        y=[],
        text=[],
        mode='markers+text',
        textposition='bottom center'
    )

    # Add nodes to the node trace
    for node in G.nodes():
        x, y = pos[node]
        node_trace['x'] += tuple([x])
        node_trace['y'] += tuple([y])
        node_trace['text'] += tuple([f'{node}'])




    # Create a figure
    fig = go.Figure(data= edge_traces + [node_trace, annotation_trace],
                    layout=go.Layout(showlegend=False,
                                    height=600,
                                    width=600,
                                    margin=dict(b=20, l=5, r=5, t=40),
                                    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)))
    # Save to file
    fig.write_image(f"frame{fra}.png", scale=5)
    frames.append(f"frame{fra}.png")


# Create a video from the frames using moviepy
clip = ImageSequenceClip(frames, fps=3)  # Set FPS (frames per second) according to your needs
clip.write_videofile("my_animation.mp4", codec='mpeg4')
# Clean up frames directory
for frame in frames:
    os.remove(frame)